import React from "react";

/**
 * Reusable form input component that provides consistent styling and behavior.
 *
 * This component eliminates duplicate form field code across Login, SignUp, and other forms
 * by providing a single, well-tested implementation with consistent styling.
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.className='form-input'] - Additional CSS classes
 * @param {string} [props.id] - Input ID for label association
 * @param {string} [props.name] - Input name attribute
 * @param {string} [props.autoComplete] - Autocomplete attribute
 *
 * @returns {JSX.Element} The form input element
 *
 * @example
 * <FormInput
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="Enter your email"
 *   required
 * />
 */
export default function FormInput({
	type = "text",
	value,
	onChange,
	placeholder,
	required = false,
	className = "form-input",
	id,
	name,
	autoComplete,
}) {
	return (
		<div className="form-group">
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				className={className}
				id={id}
				name={name}
				autoComplete={autoComplete}
			/>
		</div>
	);
}
