import { CheckboxContext } from "./CheckboxContext";

export function CheckboxGroup({ label, children, values, onChange }) {
    const isChecked = (value) => values.includes(value);
    //console.log(values);
    const toggleValue = ({ checked, value }) => {
      if (checked) {
        onChange(values.concat(value));
      } else {
        onChange(values.filter((v) => v !== value));
      }
    };
  
    return (
      <fieldset>
        <legend>{label}</legend>
        <CheckboxContext.Provider value={{ isChecked, toggleValue }}>
          {children}
        </CheckboxContext.Provider>
      </fieldset>
    );
  }