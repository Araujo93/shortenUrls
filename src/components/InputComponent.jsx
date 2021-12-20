import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';

import './input.css'

const InputComponent = () => {
    const [shortenLinks, setShortenLinks] = useState('');
    const [ links, setLinks] = useState([])
    const [copySuccess, setCopySuccess] = useState('');
    const [error, setError] = useState('')

    const inputRef = useRef(null);

    function copyToClipboard(e) {
        inputRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the the whole text area selected.
        e.target.focus();
        setCopySuccess('Copied!');
      };


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



    return (
        <div className='input__wrapper'>
            {error && <p>{error}</p>}
            <div className='input-inner'>
            <input ref={inputRef} type="text"  placeholder='Shorten a link here...' name='Url' onChange={handleChange} className='input'/>

            <button className='btn-submit' onClick={() => shoretenLinkAPI(shortenLinks)}>Shorten it!</button>
            </div>
            <ul className='url__list'>
                {links && links.map((url) => (
                    <>
                    <li ref={inputRef} key={uuidv4()}>{url} <button onClick={copyToClipboard}  className='btn-copy'>Copy</button></li>
                    
                    </>
                ))}
            </ul>
        </div>
    )
    
}

export default InputComponent
