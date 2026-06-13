import { Check } from "lucide-react";
import { techStack } from "#constants";
import Window from "./Window";

const Terminal = (props) => (
  <Window {...props} className="terminal" title="skills — zsh">
    <div className="techstack">
      <p className="label">
        <span className="text-[#00A154]">➜</span>
        <span className="ms-2 text-sky-600">~</span>
        <span className="ms-2">cat skills.txt</span>
      </p>

      <ul className="content">
        {techStack.map(({ category, items }) => (
          <li key={category}>
            <Check className="check" />
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="footnote">
        <p>
          <Check className="size-4" /> Always learning something new.
        </p>
      </div>
    </div>
  </Window>
);

export default Terminal;
