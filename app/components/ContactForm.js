'use client'
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    emailjs.sendForm('service_1o3f1un', 'template_876czll', form.current, 'pc_TStT_UQhORjnR2')
      .then(() => {
          setStatus('Thank you! Your message has been sent.');
          e.target.reset();
          setTimeout(() => setStatus(''), 3000);
      }, () => {
          setStatus('Sorry, there was an error. Please try again.');
          setTimeout(() => setStatus(''), 3000);
      });
  };

  return (
    <div className="bg-white/90 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-lg w-full font-pressStart relative z-30">
      <h2 className="text-sm md:text-base text-black mb-6 text-center uppercase">DROP A MESSAGE 📬</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-4 text-xs md:text-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[10px] text-gray-500 uppercase">Your Name</label>
            <input type="text" name="user_name" required className="w-full border-2 border-black p-2 bg-gray-50 focus:bg-white outline-none focus:border-[#f8b800]" placeholder="Name" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[10px] text-gray-500 uppercase">Email</label>
            <input type="email" name="user_email" required className="w-full border-2 border-black p-2 bg-gray-50 focus:bg-white outline-none focus:border-[#f8b800]" placeholder="Email" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500 uppercase">Message</label>
          <textarea name="message" required rows="4" className="w-full border-2 border-black p-2 bg-gray-50 focus:bg-white outline-none focus:border-[#f8b800] resize-none" placeholder="What's on your mind?"></textarea>
        </div>
        <button type="submit" className="w-full bg-[#f8b800] border-2 border-black text-black font-bold py-3 mt-4 hover:bg-yellow-400 active:translate-y-1 transition-all cursor-pointer">
          SEND
        </button>
        {status && <p className="text-center text-[10px] mt-2 text-blue-600">{status}</p>}
      </form>
    </div>
  );
}
