import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Img1 from './img/img1.jpeg';
import Img2 from './img/img2.jpeg';
import Img3 from './img/img3.jpeg';
import Img4 from './img/img4.jpeg';
import './gallery.css';

const Gallery = () => {
    let data = [
        { id: 1, imgSrc: Img1 },
        { id: 2, imgSrc: Img2 },
        { id: 3, imgSrc: Img3 },
        { id: 4, imgSrc: Img4 },
        { id: 5, imgSrc: Img1 },
    ];

    const [model, setModel] = useState(false);
    const [tempimgSrc, setTempImgSrc] = useState("");

    const getImg = (imgSrc) => {
        setTempImgSrc(imgSrc);
        setModel(true);
    };

    return (
        <>
            <h1 className="gallery-title">Explore Creativity with ARQ</h1>
            <h2 className="arq-title">A Visual Journey Through Creativity</h2>
            <div className={model ? "model open" : "model"}>
                <img src={tempimgSrc} alt="Expanded view" />
                <CloseIcon onClick={() => setModel(false)} />
            </div>
            <div className="gallery">
                {data.map((item) => (
                    <div className="pics" key={item.id} onClick={() => getImg(item.imgSrc)}>
                        <img src={item.imgSrc} style={{ width: "100%" }} alt={`Gallery ${item.id}`} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Gallery;
