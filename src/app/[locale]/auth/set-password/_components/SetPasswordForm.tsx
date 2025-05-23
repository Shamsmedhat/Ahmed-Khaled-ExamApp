"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import SocialLinks from "../../_components/SocialLinks";
import PasswordInput from "../../_components/PasswordInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ResetPasswordField,
  resetPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import useResetPassword from "../_hooks/use-setPassword";

export default function SetPasswordForm() {
  // translation
  const t = useTranslations();
  // mutation
  const { isPending, error, resetPasswordFn } = useResetPassword();
  // form
  const form = useForm<ResetPasswordField>({
    defaultValues: {
      email: "",
      newPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit: SubmitHandler<ResetPasswordField> = (values) => {
    resetPasswordFn(values);
  };
  return (
    <div className="bg-white w-[500px]  rounded-md  flex flex-col gap-12 py-10">
      <h2 className="text-2xl font-bold"> {t("set-password")}</h2>
      <Form {...form}>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* label */}
                  <FormLabel className="sr-only">{t("email")}</FormLabel>
                  {/* field */}
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("email")}
                      className={`${
                        form.formState.errors.email
                          ? "focus-visible:border-red-300"
                          : ""
                      }`}
                    />
                  </FormControl>
                  {/* feedback */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <PasswordInput
              name="newPassword"
              placeholder={t("create-password")}
            />
            {error && <p className="text-red-500 italic">{error.message}</p>}
            <Button
              className="w-full rounded-2xl h-14 text-lg "
              disabled={
                isPending ||
                (form.formState.isSubmitted && !form.formState.isValid)
              }
            >
              {t("set-password")}
            </Button>
          </form>
        </FormProvider>
      </Form>
      <SocialLinks />
    </div>
  );
}
