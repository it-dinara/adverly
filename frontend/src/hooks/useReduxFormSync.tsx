import { useEffect } from "react";
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
import { FormsTypes } from "Types/form";

interface UseReduxFormSyncProps<T extends FieldValues> {
  formField: FormsTypes; // e.g. "AUTO", "SERVICES"
  schema: ZodType<T, any, T>; // Zod schema for validation
  defaultValues?: T; // optional default values
  mode?: "onChange" | "onBlur" | "onSubmit"; // optional mode for form validation
}

export default function useReduxFormSync<T extends FieldValues>({
  formField,
  schema,
  defaultValues = {} as T,
}: UseReduxFormSyncProps<T>): UseFormReturn<T> {
  // Select the current state slice (e.g., state.form.AUTO)
  const storedData = useAppSelector((state) => state.form[formField]);

  const dispatch = useAppDispatch();

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    // Initialize with stored data, if available, otherwise your provided default
    defaultValues: (storedData
      ? storedData
      : defaultValues) as DefaultValues<T>,
  });
  const { setValue, watch } = methods;

  // When the component mounts, load stored values into the form
  useEffect(() => {
    if (storedData) {
      const dataKeys = Object.keys(storedData) as (keyof typeof storedData)[];
      dataKeys.forEach((key) => {
        setValue(key as Path<T>, storedData[key]);
      });
    }
    return () => {
      
    }  
  }, [setValue]);

  // Subscribe to form changes, and update Redux with a debounce
  useEffect(() => {
    const debouncedUpdate = debounce((data) => {
      dispatch(updateData({ field: formField, value: data }));
    }, 1000);

    const subscription = watch((data) => {
      debouncedUpdate(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return methods;
}
