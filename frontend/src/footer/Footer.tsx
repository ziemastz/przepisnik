import constants from '../constants';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer_rights">{constants.footer.rightsText}</div>
            <div className="footer_donate">
                <a
                    href="https://liberapay.com/Tozi/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        alt="Donate using Liberapay"
                        src="https://liberapay.com/assets/widgets/donate.svg"
                    />{' '}
                </a>
                <a href="https://ko-fi.com/P5P71NYXX8" target="_blank" rel="noopener noreferrer">
                    <img
                        height={30}
                        src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
                        alt="Buy Me a Coffee at ko-fi.com"
                    />
                </a>
            </div>
        </footer>
    );
};
export default Footer;
