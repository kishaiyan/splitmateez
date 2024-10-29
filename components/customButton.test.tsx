import CustomButton from "./customButton";
import { render } from "@testing-library/react-native"

describe("CustomButton", () => {
  it("renders correctly", () => {
    const { getByText } = render(<CustomButton title="Test" />)
    expect(getByText("Test")).toBeTruthy()
  })
  it("renders with custom color", () => {
    const { getByTestId } = render(<CustomButton title="Test" containerStyle="bg-red-500" />)
    expect(getByTestId("button").props.style).toHaveProperty("backgroundColor", "#ef4444")
  })

})
