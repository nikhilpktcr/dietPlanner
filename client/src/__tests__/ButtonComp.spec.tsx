import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/FormFields/ButtonComp'; 

describe('Button Component', () => {
  test('renders the button with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const buttonElement = screen.getByText(/Primary Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700');
  });

  test('renders the button with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText(/Secondary Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('gray-400 text-gray-900 hover:bg-gray-500 focus:ring-gray-600');
  });

  test('renders the button with danger variant', () => {
    render(<Button variant="danger">Danger Button</Button>);
    const buttonElement = screen.getByText(/Danger Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-red-800 text-white hover:bg-red-900 focus:ring-red-700');
  });

  test('renders the button with success variant', () => {
    render(<Button variant="success">Success Button</Button>);
    const buttonElement = screen.getByText(/Success Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-green-800 hover:bg-green-900 text-white focus:ring-green-700');
  });

  test('applies additional class names', () => {
    render(<Button className="extra-class">Button with Extra Class</Button>);
    const buttonElement = screen.getByText(/Button with Extra Class/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('extra-class');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const buttonElement = screen.getByText(/Clickable Button/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText(/Disabled Button/i);
    expect(buttonElement).toBeDisabled();
  });
});
