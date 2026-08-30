const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json({limit:'100kb'}));
app.use(express.static(path.join(__dirname)));

const CLINIC_KNOWLEDGE = `
You are the official virtual assistant for Dr. S One Multi Specialist Clinic in Jodhpur.
Verified clinic facts:
- Address: 272, B Road, Near Boys Zone, Laxmi Nagar, Paota, Jodhpur 342006.
- Timing: 9:00 AM to 9:00 PM.
- Services: skin consultation/treatments, hair consultation/treatments, dental consultation/treatments, Hydra Facial, Carbon Peel, Hair GFC.
- Stored fees: Hydra Facial ₹1,599; Carbon Peel ₹1,599; Hair GFC ₹3,099.
- Appointment: collect name, mobile number, preferred date/time and service; do not claim a booking is confirmed unless a real booking system confirms it.
- Safety: do not diagnose, prescribe medicines, promise outcomes, or give emergency treatment instructions. For medical diagnosis/treatment decisions, direct the person to a qualified doctor/clinic staff.
- Never invent clinic fees, doctor qualifications, timings, offers, services, or availability. If information is not in the verified facts, say that the clinic should confirm it.
Answer naturally in the user's language (Hindi/Hinglish/English). Keep normal answers concise and helpful.
`;

app.post('/api/chat', async (req,res)=>{
  try {
    if(!process.env.GEMINI_API_KEY) return res.status(500).json({error:'GEMINI_API_KEY is not configured on the server.'});
    const message = String(req.body?.message||'').trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
    if(!message) return res.status(400).json({error:'Message is required.'});
    const contents = history.map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:String(x.text||'')}]}));
    if(!contents.length || contents[contents.length-1].parts[0].text!==message) contents.push({role:'user',parts:[{text:message}]});
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key='+encodeURIComponent(process.env.GEMINI_API_KEY),{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:CLINIC_KNOWLEDGE}]},contents,generationConfig:{temperature:0.2,maxOutputTokens:400}})
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||'Gemini API error'});
    const answer=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
    if(!answer) return res.status(502).json({error:'No answer returned by AI.'});
    res.json({answer});
  } catch(e){res.status(500).json({error:e.message||'Server error'});}
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Clinic AI server running on http://localhost:${port}`));
