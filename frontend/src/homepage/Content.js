import React from 'react'
import { useAppContext } from '../context/AppContext';
import AddPatient from './attendant/AddPatient';
import AllPatients from './attendant/AllPatients';
import ViewPatients from './nurse/ViewPatients';
import UpdateTreatments from './nurse/UpdateTreatments';
import ListPatient from './doctor/ListPatients';
import ViewTreatments from './doctor/ViewTreatments';
import PatientTreatmentView from './nurse/PatientTreatmentView';



const Content = () => {
    const {content } = useAppContext();


  return (
  
  <>
    {content === "addpatient" && (<AddPatient />)}
    {content === "allpatients" && (<AllPatients />)}
    {content === "viewpatients" && (<ViewPatients />)}
{content === "updatetreatments" && (<UpdateTreatments />)}
{content === "patientcheck" && (<ListPatient />)}
{content === "viewtreatments" && (<ViewTreatments />)}
{content === "PatientTreatmentView" && (<PatientTreatmentView />)}

  </>
  )
}

export default Content
