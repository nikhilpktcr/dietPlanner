import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "../components/ModalComp";
const mockOnClose = jest.fn();
describe("Modal Componet",()=>{
    test("render modal with children",()=>{
        render(
            <Modal isOpen={true} testId="checkModalInput" onClose={mockOnClose} >
                <h1>Test Modal</h1>
            </Modal>
        )
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
    });
    test("close modal if onclose fires",()=>{
        render(
            <Modal isOpen={true} testId="checkModalInput" onClose={mockOnClose} >
                <h1>Test Modal</h1>
                <button data-testid="testModalCloseBtn" onClick={mockOnClose}>close</button>
            </Modal>
        )
        fireEvent.click(screen.getByTestId("testModalCloseBtn"))

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        
    })
})