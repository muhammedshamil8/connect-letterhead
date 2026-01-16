import ConnectLogo from '../assets/Images/connect.svg';
import ConnectHeader from '../assets/Images/Connect_header.png';
import ConnectWatermark from '../assets/Images/Connect_watermark.png';
import IEDCLogo from '../assets/Images/IEDC/IEDClogo_transparent.png';
import IEDCHeader from '../assets/Images/IEDC/IEDC_Header.png';
import IEDCWatermark from '../assets/Images/IEDC/IEDC_Watermark.png';
import IEDCFooter from '../assets/Images/IEDC/IEDC_Footer.png';

import TinkerHubLogo from '../assets/Images/TinkerHub/Tinkerhub.jpeg';
import TinkerHubHeader from '../assets/Images/TinkerHub/Tinkerhub_header.png';
import TinkerHubWatermark from '../assets/Images/TinkerHub/Tinkerhub_watermark.png';

type ClubsType = {
    [key: string]: {
        name: string,
        website: string,
        logo: string,
        header: string,
        watermark: string,
        watermarkPosition: number,
        haveCustomFooter: boolean,
        footer?: string, //required if haveCustomFooter is true
        color: string,
    }
}

export const Clubs: ClubsType = {
    Connect: {
        name: "Connect",
        website: "connectemea.in",
        logo: ConnectLogo,
        header: ConnectHeader,
        watermark: ConnectWatermark,
        watermarkPosition: 230,
        haveCustomFooter: false,
        color: "#2c2870",
    },
    IEDC: {
        name: "IEDC EMEA",
        website: "",
        logo: IEDCLogo,
        header: IEDCHeader,
        watermark: IEDCWatermark,
        watermarkPosition: 160,
        haveCustomFooter: true,
        footer: IEDCFooter,
        color: "#24956a",
    },
    TinkerHub: {
        name: "TinkerHub EMEA",
        website: "tinkerhub.org",
        logo: TinkerHubLogo,
        header: TinkerHubHeader,
        watermark: TinkerHubWatermark,
        watermarkPosition: 100,
        haveCustomFooter: false,
        color: "#2c2870",
    },
};