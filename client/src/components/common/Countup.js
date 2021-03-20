import { useEffect, useState } from "react";

export default function Countup(props) {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");
  const speed = 1000 / props.end;
  // eslint-disable-next-line
  useEffect(() => {
    if (props.startCounter) {
      if (count < props.end && count < 1000) {
        setTimeout(() => {
          setCount((prevCount) => prevCount + 1);
        }, speed);
      } else {
        setValue(props.end >= 1000 ? `${props.end / 1000}k` : props.end);
      }
    }
  });
  return (
    <div className={props.className}>
      {props.startCounter ? value || count : "0"}
    </div>
  );
}
