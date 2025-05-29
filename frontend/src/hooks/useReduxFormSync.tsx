import { useEffect, useCallback } from "react";
import {
  useForm,
  UseFormReturn,
  DefaultValues,
  Path,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "Utils/debounce";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { updateData } from "Redux/slices/formSlice";
import { ZodType } from "zod";
import { FormState } from "Types/form";

interface UseReduxFormSyncProps<T extends FieldValues> {
  formField: keyof FormState; // e.g. "AUTO", "SERVICES"
  schema: ZodType<T, any, T>; // Zod schema for validation
  defaultValues?: T; // optional default values
  mode?: "onChange" | "onBlur" | "onSubmit"; // optional mode for form validation
}

export default function useReduxFormSync<T extends FieldValues>({
  formField,
  schema,
  defaultValues = {} as T,
  mode,
}: UseReduxFormSyncProps<T>): UseFormReturn<T> {
  // Select the current state slice (e.g., state.form.AUTO)
  const storedData = useAppSelector((state) => state.form);

  const dispatch = useAppDispatch();

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    // Initialize with stored data, if available, otherwise your provided default
    defaultValues: (storedData
      ? storedData
      : defaultValues) as DefaultValues<T>,
    mode: mode,
  });
  const { setValue, watch } = methods;

  // When the component mounts, load stored values into the form
  useEffect(() => {
    if (storedData) {
      console.log("storedData", storedData);
      const dataKeys = Object.keys(storedData);
      dataKeys.forEach((key) => {
        setValue(key as Path<T>, storedData[key]);
      });
      // setValue("form", storedData);
    }
    return () => {};
  }, [setValue]);

  const { debounced, cancel } = useCallback(
    () =>
      debounce((data) => {
        console.log("formField", formField, "data", data);

        dispatch(updateData({ field: formField, value: data }));
      }, 1000),
    [dispatch, formField]
  )();

  useEffect(() => {
    const subscription = watch((data) => {
      debounced(data);
    });
    return () => {
      subscription.unsubscribe();
      cancel();
    };
  }, [watch, debounced, cancel]);

  return methods;
}
