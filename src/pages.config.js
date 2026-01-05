import PrivacyPolicy from './pages/PrivacyPolicy';
import Intelligence from './pages/Intelligence';
import __Layout from './Layout.jsx';


export const PAGES = {
    "PrivacyPolicy": PrivacyPolicy,
    "Intelligence": Intelligence,
}

export const pagesConfig = {
    mainPage: "Intelligence",
    Pages: PAGES,
    Layout: __Layout,
};