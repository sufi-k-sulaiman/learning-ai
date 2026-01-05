import Intelligence from './pages/Intelligence';
import PrivacyPolicy from './pages/PrivacyPolicy';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Intelligence": Intelligence,
    "PrivacyPolicy": PrivacyPolicy,
}

export const pagesConfig = {
    mainPage: "Intelligence",
    Pages: PAGES,
    Layout: __Layout,
};