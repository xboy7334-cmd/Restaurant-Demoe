interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantityStepper({ value, onChange }: QuantityStepperProps) {
  return (
    <div className="stepper" aria-label="Quantity selector">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</button>
    </div>
  );
}
