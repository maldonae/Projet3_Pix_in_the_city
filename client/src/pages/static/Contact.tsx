import "../../styles (anciennement CSS)/pages/Contact.css";
import Header from "../../components/common/Header";

import IconFacebook from "../../assets/images/contacts/icon_facebook.png";
import IconInstagram from "../../assets/images/contacts/icon_instagram.png";
import IconX from "../../assets/images/contacts/icon_X.png";
import IconMail from "../../assets/images/contacts/icon_mail.png";

function Contact() {
  return (
    <>
      <Header />
      <section className="container_contact">
        <div className="title">
          <h1 id="contacts">CONTACTS</h1>
        </div>
        <div className="RS">
          <div className="box">
            <a href="http://facebook.com">
              <img
                src={IconFacebook}
                alt="logo_facebook"
              />
              FACEBOOK
            </a>
          </div>
          <div className="box">
            <a href="http://instagram.com">
              <img
                src={IconInstagram}
                alt="logo_instagram"
              />
              INSTAGRAM
            </a>
          </div>
          <div className="box">
            <a href="http://x.com">
              <img
                src={IconX}
                alt="logo_X"
              />
              X
            </a>
          </div>
          <div className="box">
            <a href="http://Mail.com">
              <img
                src={IconMail}
                alt="logo_mail"
              />
              MAIL
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
