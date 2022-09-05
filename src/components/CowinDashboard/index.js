import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

class CowinDashboard extends Component {
  state = {listdata: {}, loader: true, failureView: false}

  componentDidMount = () => {
    this.getData()
  }

  getData = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    const respData = await response.json()
    console.log(respData)
    const updatedData = {
      last7DaysVaccination: respData.last_7_days_vaccination.map(each => ({
        dose1: each.dose_1,
        dose2: each.dose_2,
        vaccineDate: each.vaccine_date,
      })),
      vaccinationByAge: respData.vaccination_by_age.map(each => ({
        age: each.age,
        count: each.count,
      })),
      vaccinationByGender: respData.vaccination_by_gender.map(each => ({
        count: each.count,
        gender: each.gender,
      })),
    }
    console.log(updatedData)

    if (response.status === 200) {
      this.setState({failureView: false})
    } else {
      this.setState({failureView: true})
    }
    this.setState({loader: false})
    this.setState({listdata: updatedData})
  }

  render() {
    const {listdata, loader, failureView} = this.state

    return (
      <div className="bg-container">
        <div className="web-logo-card">
          <img
            className="web-logo-img"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="web-name-h">Co-WIN</h1>
        </div>
        <h1 className="web-h1">CoWIN Vaccination in india</h1>
        {failureView === true ? (
          <div className="failure-view">
            <img
              className="f-img"
              src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
              alt="failure view"
            />
            <h1 className="f-p">Something went wrong</h1>
          </div>
        ) : (
          <>
            <VaccinationCoverage vcDetails={listdata.last7DaysVaccination} />
            <VaccinationByGender vcByGDetails={listdata.vaccinationByGender} />
            <VaccinationByAge vbaDetails={listdata.vaccinationByAge} />
          </>
        )}

        {loader === true ? (
          <div className="loader">
            <Loader
              testid="loader"
              color="#ffffff"
              height={80}
              type="ThreeDots"
              width={80}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default CowinDashboard
