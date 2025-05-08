import React  from 'react'
import { useAppContext } from '../context/AppContext';
import AddPatient from '../components/attendant/AddPatient';
import AllPatients from '../components/attendant/AllPatients';
import ViewPatients from '../components/nurse/ViewPatients';
import UpdateTreatments from '../components/nurse/UpdateTreatments';
import ListPatient from '../components/doctor/ListPatients';
import ViewTreatments from '../components/doctor/ViewTreatments';
import PatientTreatmentView from '../components/nurse/PatientTreatmentView';
import Discharge from '../components/doctor/Discharge';
import GeneratePDF from '../components/doctor/GeneratePDF';
import ChatBox from '../components/doctor/ChatBox';
import DeletePatient from '../components/doctor/DeletePatient';



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
{content === "discharge" && (<Discharge />)}
{content === "generatepdf" && (<GeneratePDF />)}
{content === "chatbox" && (<ChatBox />)}
{content === "deletepatient" && (<DeletePatient />)}




  </>
  )
}

export default Content
