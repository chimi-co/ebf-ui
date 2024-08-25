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
          <h1 className="text-2xl">What is Impact Scribe?</h1>
          <p>
            Impact Scribe is an exciting new tool for utilizing the Ecological Benefits Framework (EBF) to assess and communicate your project's impact in six key areas:
          </p>
          <div className="ml-8 mb-4">
            <ul className="list-disc">
              <li>Air</li>
              <li>Water</li>
              <li>Soil</li>
              <li>Biodiversity</li>
              <li>Equity</li>
              <li>Carbon</li>
            </ul>
          </div>
          <p>
            Impact Scribe gathers information about your project in order to generate an EBF Impact Certificate and your EBF Digital Fingerprint.
          </p>
          <p>
            Follow these three easy steps get started:
          </p>
          <div className="ml-8 mb-4">
            <ol className="list-decimal">
              <li>Click the “Connect” button at the top right corner of this screen;</li>
              <li>Create an account;</li>
              <li>Click the “Start a new survey” button to begin the EBF questionnaire.</li>
            </ol>
          </div>
          <p>
            To learn more about EBF, see the What is EBF section below.
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
