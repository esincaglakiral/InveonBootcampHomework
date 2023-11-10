import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tutorialService from "../Services/tutorial.service";

function Tutorial() {
  // useParams hook'u ile id'yi aldım
  const { id } = useParams();

  // Component'in state'i
  const [updatingTutorial, setUpdatingTutorial] = useState({
    id: null,
    title: "",
    description: "",
    published: false,
  });

  // useEffect hook'u ile component monte edildiğinde detayları çektim
  useEffect(() => {
    detailTutorial(id);
  }, [id]);

  // Detayları çeken fonksiyon
  const detailTutorial = (tutorialId) => {
    tutorialService
      .get(tutorialId)
      .then((receivedTutorial) => {
        // Gelen detayları state'e set ettim
        setUpdatingTutorial(receivedTutorial.data);
      })
      .catch((error) => {
        console.log("Details couldn't be fetched: " + error);
      });
  };

  // State'ten gelen tutorial bilgilerini kullanarak detay sayfasını oluşturdum
  return (
    <div>
      <h2>{updatingTutorial.title}</h2>
      <p>{updatingTutorial.description}</p>
      <p>{updatingTutorial.published ? "Published" : "Not Published"}</p>
    </div>
  );
}

export default Tutorial;
