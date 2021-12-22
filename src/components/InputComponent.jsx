import React, { useState, useEffect, useRef } from 'react'

import { v4 as uuidv4 } from 'uuid';

import './input.css'

// Move the complex logic into another file.
const InputComponent = () => {
    const [shortenLinks, setShortenLinks] = useState('');
    const [ links, setLinks] = useState([])
    // would have like to finish the copying of the URLS
    const [copySuccess, setCopySuccess] = useState('');
    // a nicer Looking error message
    const [error, setError] = useState('')

    const copyText = useRef()

    console.log(copyText.current)
// Move the complex logic into another file.

const shoretenLinkAPI = async (url) => {
    try{
        const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
        if(response.ok === false) {
            setError('Need to provide a URL, please try again!')
            return
        }
        const data = await response.json();
        setLinks(prevLinks => [...prevLinks, data.result.full_short_link])
        localStorage.setItem('data', JSON.stringify(data))
       setError('')
    } catch (e) {
        console.log(e)
        }
    }


const handleChange = (e) => {
    setShortenLinks(e.target.value)
}


// Load all Urls on reload, but its only finding most recent. Would of rather used a backend database
// to store all urls and load them
useEffect(() => {
    try{
        const existingUrls = localStorage.getItem('data');
      const myLinks = JSON.parse(existingUrls).result.full_short_link
       if(!myLinks)return
        setLinks(prevLinks => [...prevLinks, myLinks])
    } catch(e) {
        console.log(e)
    }
}, [])


    // Lots of more styling could have been done.
    return (
        <div className='input__wrapper'>
            {error && <p>{error}</p>}
            <div className='input-inner'>
            <input type="text"  placeholder='Shorten a link here...' name='Url' onChange={handleChange} className='input'/>

            <button className='btn-submit' onClick={() => shoretenLinkAPI(shortenLinks)}>Shorten it!</button>
            </div>
            
            <ul className='url__list'>
                {links && links.map((url) => (
                    <div className='container__url' key={uuidv4()}>
                    <li ref={copyText} >{url}
                     </li>
                     <button  onClick={() => navigator.clipboard.writeText(copyText.current.innerText)}  className='btn-copy'>Copy</button>
                     
                    </div>
                ))}
            </ul>
        </div>
    )
    

}

export default InputComponent
