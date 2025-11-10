import { useRouter } from "expo-router";
import React, {
  Children,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { BackHandler, View } from "react-native";

interface Props {
  children: ReactNode;
}

export interface MultiStepFormRef {
  nextStep: () => void;
  previousStep: () => void;
}

const MultiStepForm = forwardRef<MultiStepFormRef, Props>(
  ({ children }: Props, ref) => {
    const childrenCount = Children.count(children);
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
      nextStep: () => {
        if (currentStep < childrenCount) {
          setCurrentStep(currentStep + 1);
        }
      },
      previousStep: () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        } else {
          router.back();
        }
      },
    }));

    useEffect(() => {
      const backAction = () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          return true; // Previne o comportamento padrão
        }
        return false; // Permite o comportamento padrão (router.back)
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [currentStep]);

    return (
      <View style={{ flex: 1 }}>{Children.toArray(children)[currentStep]}</View>
    );
  }
);
export default MultiStepForm;
