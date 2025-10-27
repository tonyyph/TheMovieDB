import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle
} from "react-native";

interface CustomTextProps extends RNTextProps {
  weight?: "regular" | "bold" | "semibold" | "light" | "black" | "extralight";
  italic?: boolean;
}

const Text: React.FC<CustomTextProps> = ({
  style,
  weight = "regular",
  italic = false,
  ...props
}) => {
  const getFontFamily = () => {
    const baseFamily = "SourceSansPro";
    let variant = "";

    switch (weight) {
      case "bold":
        variant = "Bold";
        break;
      case "semibold":
        variant = "Semibold";
        break;
      case "light":
        variant = "Light";
        break;
      case "black":
        variant = "Black";
        break;
      case "extralight":
        variant = "ExtraLight";
        break;
      default:
        variant = "Regular";
    }

    if (italic) {
      variant += "Italic";
    }

    return `${baseFamily}-${variant}`;
  };

  const defaultStyle: TextStyle = {
    fontFamily: getFontFamily()
  };

  return <RNText style={[defaultStyle, style]} {...props} />;
};

export default Text;
