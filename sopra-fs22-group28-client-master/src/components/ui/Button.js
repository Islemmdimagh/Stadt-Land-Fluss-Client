import "styles/ui/Button.scss";

export const Button = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-button ${props.className}`}>
    {props.children}
  </button>
);

export const InfoButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`info-button ${props.className}`}>
    {props.children}
  </button>
);

export const CategorieButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`categorie-button ${props.className}`}>
    {props.children}
  </button>
);

export const SettingButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`settings-button ${props.className}`}>
    {props.children}
  </button>
);

export const LetterButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`letter-button ${props.className}`}>
    {props.children}
  </button>
);
