// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { describe, it, expect, vi } from 'vitest';
// import DropDown from "../src/components/common/DropDown";


// describe('DropDown component', () => {
//   const mockOptions = ['Cardiology', 'Dermatology', 'Neurology'];

//   it('renders placeholder and all options', async () => {
//     render(
//       <DropDown
//         value=""
//         onChange={() => {}}
//         options={mockOptions}
//         placeholder="Specialties"
//       />
//     );

//     // Placeholder should appear before dropdown is opened
//     expect(screen.getByText('Specialties')).toBeInTheDocument();

//     // Open dropdown
//     await userEvent.click(screen.getByRole('button'));

//     // "All Specialties" should appear
//     expect(screen.getByText('All Specialties')).toBeInTheDocument();

//     // Each option should appear
//     mockOptions.forEach((option) => {
//       expect(screen.getByText(option)).toBeInTheDocument();
//     });
//   });

//   it('calls onChange when an option is selected', async () => {
//     const handleChange = vi.fn();

//     render(
//       <DropDown
//         value=""
//         onChange={handleChange}
//         options={mockOptions}
//         placeholder="Specialties"
//       />
//     );

//     await userEvent.click(screen.getByRole('button'));

//     // Click on "Dermatology"
//     await userEvent.click(screen.getByText('Dermatology'));

//     expect(handleChange).toHaveBeenCalledWith('Dermatology');
//   });

//   it('renders custom "All ..." label if provided', async () => {
//     render(
//       <DropDown
//         value=""
//         onChange={() => {}}
//         options={mockOptions}
//         placeholder="Fields"
//         showAllLabel="All Fields"
//       />
//     );

//     await userEvent.click(screen.getByRole('button'));

//     expect(screen.getByText('All Fields')).toBeInTheDocument();
//   });
// });
