import { Form } from "react-bootstrap";
import { CheckboxContext } from "./CheckboxContext";
import { useContext } from "react";

export function Checkbox({ children, disabled, value, checked, onChange }) {
    const context = useContext(CheckboxContext);
  
    if (!context) {
      return (
        <Form.Check style={{margin: "5px"}}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          id={children}
          label={children}
        />
      );
    }
  
    const { isChecked, toggleValue } = context;
  
    return (
      <Form.Check style={{margin: "5px"}}
        inline
        type="checkbox"
        disabled={disabled}
        checked={isChecked(value)}
        onChange={(event) =>
          toggleValue({ checked: event.target.checked, value })
        }
        id={children}
        label={
          <div style={{minWidth: "42px"}}>
            {children}
          </div>
        }
      />
    );
  }