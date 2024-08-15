import {useEffect} from "react"

import './styles.css'

export default function Home() {

  useEffect(() => {
    const divElement = document.getElementById('main');
    divElement.classList.add('main-home');

    return () => {
      divElement.classList.remove('main-home');
    };
  }, [])

  return(
    <div className="home-page">
      <div className="description-container">
        <div className="text font-semibold">
          <h1 className="text-2xl">What is ImpactScribe?</h1>
          <p>
            A tool for assessing your projects impact in Six Key Areas: Air, Water, Soil, Biodiversity, Equity, and Carbon
            using the Ecological Benefits Framework (EBF). This tool will gather information about your project in order
            to generate an EBF Impact Report, an EBF Impact Certificate and your EBF digital fingerprint.
          </p>
          <p>
            In order to get started click Connect to create an account and then click Surveys to begin the EBF questionaire.
          </p>
        </div>
        <div className="text font-semibold">
          <h1 className="text-2xl">
            What is EBF?
          </h1>
          <p>
            The Ecological Benefits Framework (EBF) is a new paradigm. It provides a foundational architecture to
            radically transform global carbon and ecological benefits markets both by increasing transparency, trust,
            quality, and equity and by accelerating the coordinated delivery of positive financial and environmental impacts.
          </p>
          <p>
            By developing a shared framework, EBF can create alignment across public and private sectors to support
            the rapid deployment of strategic capital for activities that create measurable, life-affirming ecological
            impacts. The unprecedented coordination of financial markets, UN agencies, NGOs, companies, and philanthropic
            interests will bring attention to—and help create—a shared pathway for accelerated solutions.
          </p>
          <p>
            Learn more at https://ebfcommons.org/
          </p>
        </div>
      </div>
    </div>
  )
}
