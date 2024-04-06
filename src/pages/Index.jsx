import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorSwatch, setColorSwatch] = useState(null);
  const toast = useToast();
  const [exampleColors, setExampleColors] = useState([]);

  const fetchColorName = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  useEffect(() => {
    fetchExampleColors();
  }, []);

  const fetchExampleColors = async () => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/?values=ff0000,00ff00,0000ff`);
      if (!response.ok) {
        throw new Error("Example colors could not be loaded");
      }
      const data = await response.json();
      setExampleColors(data.colors);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      {exampleColors.length > 0 && (
        <Box mb={6}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Example Colors:
          </Text>
          <Box display="flex">
            {exampleColors.map((color) => (
              <Box key={color.hex} p={2} bg={`#${color.hex}`} borderRadius="md" boxShadow="sm" mr={2} />
            ))}
          </Box>
        </Box>
      )}
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
    </Box>
  );
};

export default Index;
