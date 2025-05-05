import React, { useState } from 'react';
import './RiskAssessment.css'
import { FaCaretLeft, FaCaretRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { predictRisk } from '../api/api';

const RiskAssessment = () => {

  const [view, setView] = useState("main")
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    education:'',
    employment: '',
    marital_status: '',
    violence: '',
    comments:''
  });
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const data = await response.json();
    console.log(data)
    setResult(data.risk_level);
  };

  const handleIncome = () => {
    setView("income")
  }
  const handleAge = () => {
    setView("main")
  }
  const handleEducation = () => {
    setView("education")
  }
  const handleEmployment = () => {
    setView("employment")
  }
  const handleMarital = () => {
    setView("marital")
  }
  const handleAbuse = () => {
    setView("abuse")
  }
  const handleComments = () => {
    setView("comments")
  }
  const handleFeedback = () => {
    setView("feedback")
  }

  return (
    <div className="assess-page">
      <h2 className="assess-header">Risk Assessment</h2>
      <form onSubmit={handleSubmit} className="">
        {view === "main" && <div className='card'>
            {/* <div><button><FaChevronLeft/></button></div> */}
            <div className=' age-part'>
            <label>How old are you?</label>
            <input type="number" name="age" value={formData.age} placeholder="Enter your age" onChange={handleChange} className="" />
            </div>
            <div><button onClick={handleEducation} ><FaChevronRight size={36}/></button></div>
        </div>}
        {view === "education" && <div className='card'>
          <div><button onClick={handleAge}><FaChevronLeft size={36}/></button></div>
          <div className=''>
            <label>Select your level of education</label>
            <select type="text" name="education" value={formData.education} placeholder="Education" onChange={handleChange} className="" >
                <option value="">Select education level</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">University/College</option>
            </select>
            </div>
            <div><button onClick={handleIncome}><FaChevronRight size={36}/></button></div>
        </div>}
        {view === "income" && <div className='card'>
          <div><button onClick={handleEducation}><FaChevronLeft size={36}/></button></div>
          <div className=''>
            <label>What is your monthly income?</label>
            <input type="text" name="income" value={formData.income} placeholder="Income" onChange={handleChange} className="" />
            </div>
            <div><button onClick={handleEmployment}><FaChevronRight size={36}/></button></div>
        </div>}
        {view === "employment" && <div className='card'>
          <div><button onClick={handleIncome}><FaChevronLeft size={36}/></button></div>
          <div>
            <label>What is your employment status?</label>
            <select type="text" name="employment" value={formData.employment} placeholder="Employment" onChange={handleChange} className="">
                <option value="">Select employment status</option>
                <option value="unemployed">unemployed</option>
                <option value="semi employed">semi employed</option>
                <option value="employed">employed</option>
            </select>
            </div>
          <div><button onClick={handleMarital}><FaChevronRight size={36}/></button></div>
        </div>}
        {view === "marital" && <div className='card'>
          <div><button onClick={handleEmployment}><FaChevronLeft size={36}/></button></div>
          <div>
            <label>Select your marital status</label>
            <select type="text" name="marital_status" value={formData.marital_status} placeholder="Marital Status" onChange={handleChange} className="" >
            <option value="">Select marital status</option>
            <option value="single">single</option>
            <option value="married">married</option>
            <option value="divorced">divorced</option>
            </select>
            </div>
          <div><button onClick={handleAbuse}><FaChevronRight size={36}/></button></div>
        </div>}
        {view ==="abuse" && <div className='card'>
          <div><button onClick={handleMarital}><FaChevronLeft size={36}/></button></div>
          <div>
            <label>Have you experienced abuse before?</label>
            <select type="text" name="violence" value={formData.violence} placeholder="Prior abuse" onChange={handleChange} className="">
            <option value="">Select one</option>
            <option value="yes">yes</option>
            <option value="no">no</option>
            </select>
            </div>
          <div><button onClick={handleComments}><FaChevronRight size={36}/></button></div>
        </div>}
        {view === "comments" && <div className='card'>
          <div><button onClick={handleAbuse}><FaChevronLeft size={36}/></button></div>
          <div>
            <label>Any comments?</label>
            <input type="text" name="comments" value={formData.comments || ''} placeholder="Type anything ..." onChange={handleChange} className="" />
            <button onClick={handleSubmit} type="submit" className="submit-assess-button">Submit</button>
            </div>
          {/* <div><button onClick={handleAge}><FaCaretRight/></button></div> */}
        </div>}
        
      </form>
      
      {result && (
        <div className="">
          <h3>Prediction Result:</h3>
          <p className="">{result}</p>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
