import { useMemo, useEffect } from "react";
import {
  useForm,
  FieldValues,
  UseFormReturn,
  DefaultValues,
  Path,
} from "react-hook-form";
import debounce from "Utils/debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { updateData } from "Redux/slices/formSlice";
import type { ZodType } from "zod";
import { FormState } from "Types/form";

interface UseReduxFormSyncProps<T extends FieldValues> {
  formField: keyof FormState; // e.g. "AUTO", "SERVICES", etc.
  schema: ZodType<T, any, T>; // Zod schema for validation
  defaultValues?: T; // optional default values
  mode?: "onChange" | "onBlur" | "onSubmit"; // form validation mode
}

export default function useReduxFormSync<T extends FieldValues>({
  formField,
  schema,
  defaultValues = {} as T,
  mode,
}: UseReduxFormSyncProps<T>): UseFormReturn<T> {
  // Select the whole form state (or a specific slice) from the Redux store
  const storedData = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  // Initialize the form with stored values if available
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: (storedData
      ? storedData
      : defaultValues) as DefaultValues<T>,
    mode,
  });
  const { setValue, watch } = methods;

  // On mount (or when storedData changes), load stored values into the form fields
  useEffect(() => {
    if (storedData) {
      Object.keys(storedData).forEach((key) => {
        setValue(key as Path<T>, storedData[key]);
      });
    }
  }, [setValue]);

  // Create a debounced update function that dispatches the updated data.
  const debouncedUpdate = useMemo(
    () =>
      debounce((data) => {
        dispatch(
          updateData({ field: formField as string | number, value: data })
        );
      }, 1000),
    [dispatch, formField]
  );

  // Subscribe to form changes and update the Redux store
  useEffect(() => {
    const subscription = watch((data) => {
      debouncedUpdate.debounced(data);
    });
    return () => {
      subscription.unsubscribe();
      debouncedUpdate.cancel();
    };
  }, [watch, debouncedUpdate]);

  return methods;
}
