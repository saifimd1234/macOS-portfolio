import { socials } from "#constants";
import Window from "./Window";

const Contact = (props) => (
  <Window {...props} className="contact" title="Contact">
    <div className="contact-body">
      <h3>Let&apos;s build something together</h3>
      <p className="subtitle">
        Reach out on any of these — I usually reply within a day.
      </p>

      <ul>
        {socials.map(({ id, text, icon, bg, link }) => (
          <li key={id} style={{ backgroundColor: bg }}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img src={icon} alt={text} className="size-8" />
              <p>{text}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </Window>
);

export default Contact;
