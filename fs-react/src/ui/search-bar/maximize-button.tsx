import React, {useContext, useState} from "react";
import {WikiContext} from "../../index";
import {Link} from "@mui/material";
import Box from "@mui/material/Box";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";

function MaximizeButton(prop: {

}) {
    const wikiContext = useContext(WikiContext);
    const [toggle, setToggle] = useState(false);
    const skin = wikiContext.config['skin'];
    if (skin !== 'chameleon') return;

    const toggleSize = () => {
        const browserWindow = window as any;
        if (!browserWindow.$) return;
        browserWindow.$('.container').css( {'max-width': toggle ? '' :'100%' });
        browserWindow.$('.container-fluid').css( {'max-width': toggle ? '' :'100%' });
        setToggle(!toggle);
    };

    return <Box className={'fs-open-in-full'}>
        <Link sx={{cursor: 'pointer'}}
              target="_blank" onClick={toggleSize}>
            {toggle ? <FullscreenExit /> : <Fullscreen/>}
        </Link>
    </Box>

}

export default MaximizeButton;