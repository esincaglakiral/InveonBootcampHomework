using Inveon.Services.ShoppingCartAPI.Messages;
using Inveon.Services.ShoppingCartAPI.Models.Dto;
using Inveon.Services.ShoppingCartAPI.RabbitMQSender;
using Inveon.Services.ShoppingCartAPI.Repository;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inveon.Services.ShoppingCartAPI.Controllers
{
    [Route("api/cartc")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class CartAPICheckOutController : ControllerBase
    {

        private readonly ICartRepository _cartRepository;
        private readonly ICouponRepository _couponRepository;
        private readonly ResponseDto _response;
        private readonly IRabbitMQCartMessageSender _rabbitMQCartMessageSender;
        public CartAPICheckOutController(ICartRepository cartRepository,
            ICouponRepository couponRepository, IRabbitMQCartMessageSender rabbitMQCartMessageSender)
        {
            _cartRepository = cartRepository;
            _couponRepository = couponRepository;
            _rabbitMQCartMessageSender = rabbitMQCartMessageSender;
            _response = new ResponseDto();
        }

        [HttpPost]
        [Authorize]
        public async Task<object> Checkout([FromBody] CheckoutHeaderDto checkoutHeader)
        {
            try
            {
                CartDto cartDto = await _cartRepository.GetCartByUserId(checkoutHeader.UserId);
                if (cartDto == null)
                {
                    return BadRequest();
                }

                if (!string.IsNullOrEmpty(checkoutHeader.CouponCode))
                {
                    CouponDto coupon = await _couponRepository.GetCoupon(checkoutHeader.CouponCode);
                    if (checkoutHeader.DiscountTotal != coupon.DiscountAmount)
                    {
                        _response.IsSuccess = false;
                        _response.ErrorMessages = new List<string>() { "Coupon Price has changed, please confirm" };
                        _response.DisplayMessage = "Coupon Price has changed, please confirm";
                        return _response;
                    }
                }

                checkoutHeader.CartDetails = cartDto.CartDetails;

                Payment payment = PaymentProcess(checkoutHeader);

                _rabbitMQCartMessageSender.SendMessage(checkoutHeader, "checkoutqueue");
                await _cartRepository.ClearCart(checkoutHeader.UserId);

                string mailBody = $@"<div><div style=""padding:5%;align-items:center;justify-content:center;background-color:#2f4f4f""><h2 style=""color:#fff;font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif"">Siparişiniz için teşekkürler</p></div><br><div><p>Ödemeniz alındı, aşağıdaki tablodan sipariş detayınızı görüntüleyebilirsiniz.</p></div><br><div style=""font-family:sans-serif""><h4>Sipariş Numaranız: {checkoutHeader.CartHeaderId}</h4><table style=""border:.5vh;border-style:solid;border-radius:3%;padding:1%""><thead><tr><th>Ürün Adı</th><th>Adet</th><th>Fiyat</th></tr></thead><tbody><tr><td>{checkoutHeader.CartDetails.First().Product.Name}</td><td>{checkoutHeader.CartDetails.First().Count}</td><td>{checkoutHeader.CartDetails.First().Product.Price}</td></tr></tbody></table></div></div>";

                MailSender.MailSender.Send(checkoutHeader.Email, "Siparişiniz Alındı", mailBody);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        public Payment PaymentProcess(CheckoutHeaderDto checkoutHeaderDto)
        {
            var request = new CreatePaymentRequest();
            ConfigurePaymentRequest(ref request);

            request.Price = Math.Round(checkoutHeaderDto.OrderTotal, 2).ToString();
            request.PaidPrice = Math.Round(checkoutHeaderDto.OrderTotal, 2).ToString();
            request.PaymentCard = CreatePaymentCard(checkoutHeaderDto);

            request.BasketId = checkoutHeaderDto.CartHeaderId.ToString();
            request.BasketItems = GetBasketItems(checkoutHeaderDto.CartDetails);

            request.Buyer = CreateBuyer(checkoutHeaderDto);
            request.ShippingAddress = CreateAddress();
            request.BillingAddress = CreateAddress();

            var options = new Options();
            ConfigureOptions(ref options);

            return Payment.Create(request, options);
        }

        public void ConfigurePaymentRequest(ref CreatePaymentRequest request)
        {
            request.Locale = Locale.TR.ToString();
            request.ConversationId = new Random().Next(1111, 9999).ToString();
            request.Currency = Currency.TRY.ToString();
            request.PaymentChannel = PaymentChannel.WEB.ToString();
            request.PaymentGroup = PaymentGroup.PRODUCT.ToString();
            request.Installment = 1;
        }

        public PaymentCard CreatePaymentCard(CheckoutHeaderDto checkoutHeaderDto)
        {
            var paymentCard = new PaymentCard
            {
                CardHolderName = checkoutHeaderDto.CartHeaderId.ToString(),
                CardNumber = checkoutHeaderDto.CardNumber,
                ExpireMonth = checkoutHeaderDto.ExpiryMonth,
                ExpireYear = checkoutHeaderDto.ExpiryYear,
                Cvc = checkoutHeaderDto.CVV,
                RegisterCard = 0,
                CardAlias = "Inveon"
            };

            return paymentCard;
        }

        public Buyer CreateBuyer(CheckoutHeaderDto checkoutHeaderDto)
        {
            var buyer = new Buyer
            {
                Id = checkoutHeaderDto.UserId,
                Name = checkoutHeaderDto.FirstName,
                Surname = checkoutHeaderDto.LastName,
                GsmNumber = checkoutHeaderDto.Phone,
                Email = checkoutHeaderDto.Email,
                IdentityNumber = "78800875793",
                LastLoginDate = "2016-11-04 13:50:55",
                RegistrationDate = "2014-10-25 17:22:00",
                RegistrationAddress = "Yahya Kemal Mh. Yahya Kemal Cd. No:99 Kat:1",
                Ip = "85.35.77.114",
                City = "Istanbul",
                Country = "Turkey",
                ZipCode = "31040"
            };
            return buyer;
        }

        public Address CreateAddress()
        {
            var shippingAddress = new Address();
            shippingAddress.ContactName = "Merly Watson";
            shippingAddress.City = "Istanbul";
            shippingAddress.Country = "Turkey";
            shippingAddress.Description = "Yahya Kemal Mh. Yahya Kemal Cd. No:99 Kat:1";
            shippingAddress.ZipCode = "31040";
            return shippingAddress;
        }

        public List<BasketItem> GetBasketItems(IEnumerable<CartDetailsDto> cartItems)
        {
            var basketItems = new List<BasketItem>();

            foreach (var item in cartItems)
            {
                for (int i = 0; i < item.Count; i++)
                {
                    basketItems.Add(new BasketItem
                    {
                        Id = item.ProductId.ToString(),
                        Name = item.Product.Name,
                        Category1 = item.Product.CategoryName,
                        Price = item.Product.Price.ToString(),
                        ItemType = BasketItemType.PHYSICAL.ToString()
                    });
                }
            }

            return basketItems;
        }

        public void ConfigureOptions(ref Options options)
        {
            options.ApiKey = "sandbox-HymYosJJ7m1WjDs0JNqEbZSKpOP3U3dn";
            options.SecretKey = "sandbox-twsQWSfR41ctcuvelwrk7eswvYv6kPx6";
            options.BaseUrl = "https://sandbox-api.iyzipay.com";
        }

    }
}