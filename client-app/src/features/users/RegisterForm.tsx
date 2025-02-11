import React from "react";
import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationError from "../Errors/ValidationError";

export default observer(function RegisterForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{
        displayName: "",
        username: "",
        email: "",
        password: "",
        error: null,
      }}
      onSubmit={(values, { setErrors }) => {
        userStore.register(values).catch((error) => setErrors({ error }));
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content="Sign up to Reactivities"
            color="teal"
            textAlign="center"
          />
          <MyTextInput
            placeholder={"Display Name"}
            name={"displayName"}
          ></MyTextInput>
          <MyTextInput
            placeholder={"User Name"}
            name={"username"}
          ></MyTextInput>
          <MyTextInput placeholder={"Email"} name={"email"}></MyTextInput>
          <MyTextInput placeholder={"Password"} name={"password"}></MyTextInput>
          <ErrorMessage
            name="error"
            render={() => (
              <ValidationError errors={errors.error as unknown as string[]} />
            )}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            possitive="true"
            content="Register"
            type="submit"
            color="green"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
