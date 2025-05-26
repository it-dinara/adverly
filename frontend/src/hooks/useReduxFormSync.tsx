// hooks/useReduxFormSync.ts
import { useEffect } from "react";
import {
  useForm,
  UseFormReturn,
  DefaultValues,
  Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "Utils/debounce";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateData } from "../redux/slices/formSlice";
import {
  FormState,
} from "Types/form";
import { ZodType } from "zod";

interface UseReduxFormSyncProps<T extends FormState> {
  formField: keyof FormState; // e.g. "AUTO", "SERVICES"
  schema: ZodType<T, any, T>; // Zod schema for validation
  defaultValues?: T; // optional default values
}

export function useReduxFormSync<T extends FormState>({
  formField,
  schema,
  defaultValues = {} as T,
}: UseReduxFormSyncProps<T>): UseFormReturn<T> {
  // Select the current state slice (e.g., state.form.AUTO)
  const storedData = useAppSelector(
    (state: { form: FormState }) => state.form[formField] as unknown as T
  );

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
      const typedData = storedData;
      const dataKeys = Object.keys(typedData) as (keyof T)[];
      dataKeys.forEach((key) => {
        setValue(key as Path<T>, typedData[key] as any);
      });
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
