/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import {StatusBar} from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
//import data from './data';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = Array.from({length: 10}, (_, index) => ({
  id: index,
}));

const {width} = Dimensions.get('window');
const duration = 300;
const _size = width * 0.9;
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.5,
  spacing: 12,
  cardsGap: 15,
};
const maxVisibleItems = 3;
const colors = {
  primary: '#fcff4d',
  light: '#fff',
  dark: '#111',
};

function Card({
  index,
  totalLength,
  activeIndex,
  showImage,
  //showImageBox,
  deletePhoto,
  onChangeText, // Make sure onChangeText is included in the props
  textValue,
}: {
  totalLength: number;
  index: number;
  info: (typeof data)[0];
  activeIndex: SharedValue<number>;
  showImage: string | null;
  //showImageBox: boolean;
  deletePhoto: () => void; // Function to delete the photo
  onChangeText: (text: string) => void; // Include onChangeText in the type definition
  textValue: string;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1],
      ),
      transform: [
        {
          translateX: interpolate(
            activeIndex.value,
            [index + 1, index, index - 1],
            [-layout.cardsGap, 0, layout.width - layout.cardsGap],
            {
              extrapolateRight: Extrapolation.EXTEND,
            },
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.96, 1, 1],
          ),
        },
      ],
    };
  });
  const isFrontCard = index === 0;
  return (
    <Animated.View style={[styles.card, stylez]}>
      <Text> </Text>
      {index === 0 && (
        <Image
          source={require('./assets/Cover-Page-1.png')}
          style={styles.imageBox}
        />
      )}

      {!isFrontCard && (
        <TouchableOpacity onPress={deletePhoto} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>x</Text>
        </TouchableOpacity>
      )}
      {index !== 0 && (
        <View style={{paddingLeft: 20}}>
          <Image
            source={require('./assets/memories.jpg')}
            style={styles.imageBox2}
          />
          {!showImage && (
            <TextInput
              editable
              multiline
              value={textValue} // Set the value of TextInput
              onChangeText={onChangeText} // Pass the onChangeText prop
              style={styles.textBox}
              textAlignVertical="top"
              placeholder="Type your text here..."
            />
          )}
        </View>
      )}
      {showImage && (
        <Image source={{uri: showImage}} style={styles.imageBox3} />
      )}
      <View style={styles.cardContent} />
    </Animated.View>
  );
}

export default function App()
  {
  const activeIndex = useSharedValue(0);
  const [images, setImages] = useState<string[]>([]);
  //const [activeImageBoxes, setActiveImageBoxes] = useState<number[]>([]);
  const [textInputs, setTextInputs] = useState<string[]>([]);

  const flingUp = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      if (activeIndex.value === 0) {
        return;
      }
      activeIndex.value = withTiming(activeIndex.value - 1, {duration});
      console.log('Fling Up');
    });
  const flingDown = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      if (activeIndex.value === data.length) {
        return;
      }
      activeIndex.value = withTiming(activeIndex.value + 1, {duration});
      console.log('Fling Down');
    });

  useEffect(() => {
    // Load saved images and text from storage when the component mounts
    retrieveData();
  }, []);

  const storeData = async () => {
    try {
      // Store both images and text inputs in AsyncStorage
      await AsyncStorage.setItem(
        'selectedDataFamily',
        JSON.stringify({images, textInputs}),
      );
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  // useEffect(() => {
  //   // Load saved images from storage when the component mounts
  //   retrieveImages();
  // }, []);

  // const storeImages = async () => {
  //   try {
  //     await AsyncStorage.setItem('selectedImages', JSON.stringify(images));
  //   } catch (error) {
  //     console.error('Error storing images:', error);
  //   }
  // };

  const retrieveData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('selectedDataFamily');
      if (storedData !== null) {
        const {images: storedImages, textInputs: storedTextInputs} =
          JSON.parse(storedData);
        setImages(storedImages);
        setTextInputs(storedTextInputs);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  // const handleAddGreenBox = () => {
  //   setActiveGreenBoxes(prev => [...prev, activeIndex.value]);
  // };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 330,
      height: 460,
      cropping: true,
    }).then(image => {
      setImages(prevImages => {
        const newImages = [...prevImages];
        newImages[activeIndex.value] = image.path;
        storeData();
        console.log(activeIndex.value);
        return newImages;
      });
    });
  };

  const handleTextInputChange = (text: string) => {
    setTextInputs(prevTextInputs => {
      const newTextInputs = [...prevTextInputs];
      newTextInputs[activeIndex.value] = text;
      storeData();
      return newTextInputs;
    });
  };

  const deletePhoto = (index: number) => {
    setTextInputs(prevTextInputs => {
      const newTextInputs = [...prevTextInputs];
      newTextInputs[index] = '';
      storeData();
      return newTextInputs;
    });
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = ''; // You can also remove the entry
      storeData(); // Update stored images
      return newImages;
    });
  };

  // const handleAddImageBox = () => {
  //   //setActiveImageBoxes(prevIndices => [...prevIndices, activeIndex.value]);
  //   storeData();
  // };
  return (
    <>
      <Text style={styles.title}>Scrap Book</Text>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar hidden />

        <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              marginBottom: layout.cardsGap * 2,
            }}
            pointerEvents="box-none">
            {data.map((c, index) => {
              return (
                <>
                  <Card
                    info={c}
                    key={c.id}
                    index={index}
                    totalLength={data.length - 1}
                    activeIndex={activeIndex}
                    showImage={images[index] || null}
                    //showImageBox={activeImageBoxes.includes(index)}
                    deletePhoto={() => deletePhoto(index)}
                    onChangeText={(text: string) => handleTextInputChange(text)} // Pass onChangeText handler
                    textValue={textInputs[index] || ''} // Pass text value
                  />
                </>
              );
            })}
          </View>
        </GestureDetector>
        <View
          style={{
            margin: 0,
            padding: 0,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{padding: 10, paddingRight: 50}}>
            <Button
              title="Stick a Picture"
              onPress={() => choosePhotoFromLibrary()}
            />

          </View>
          {/* <View style={{padding: 10}}>
            <Button title="Add Text" onPress={() => handleAddImageBox()} />
          </View> */}
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: layout.spacing,
    paddingTop: 40,
  },
  card: {
    position: 'relative',
    borderRadius: layout.borderRadius,
    width: layout.width,
    height: layout.height,
    padding: layout.spacing,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    backgroundColor: '#fcff4d',
    paddingTop: 50,
    paddingLeft: 125,
  },
  subtitle: {},
  cardContent: {
    gap: layout.spacing,
    marginBottom: layout.spacing,
  },
  locationImage: {
    flex: 1,
    borderRadius: layout.borderRadius - layout.spacing / 2,
  },
  row: {
    flexDirection: 'row',
    columnGap: layout.spacing / 2,
    alignItems: 'center',
  },
  greenBox: {
    width: 330,
    height: 460,
    backgroundColor: 'green',
    borderRadius: 8,
  },
  imageBox: {
    marginTop: 2,
    width: 330,
    height: 480,
    borderRadius: 6,
  },
  imageBox2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 47,
    borderRadius: 40,
  },
  imageBox3: {
    marginLeft: 20,
    marginTop: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 400,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8, // Adjust this value as per your requirement
    right: 8, // Adjust this value as per your requirement
    backgroundColor: '#D3D3D3', // Example background color
    borderRadius: 20, // Adjust this value to make it circular
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: 'white', // Example text color
    fontSize: 12,
  },
  textBox: {
    width: 300,
    height: 400,
  },
});
