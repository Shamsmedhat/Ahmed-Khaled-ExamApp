"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswersFields, ExamSchema } from "@/lib/schemas/exam.schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Examduration from "./exam-duration";
import useCheckQuestion from "../_hooks/use-checkQuesstion";
import Score from "./score";
// types
type QuestionsFormProps = {
  questions: QuestionResponse[];
};

export default function QuestionForm({ questions }: QuestionsFormProps) {
  // Form
  const form = useForm<AnswersFields>({
    resolver: zodResolver(ExamSchema),
  });

  // state
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] =
    useState<SuccessfullRespone<CheckResponse> | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Mutation
  const { isPending, checkQuestios } = useCheckQuestion();

  // variable
  const currentQuestion = questions[step];

  // Functions
  const onSubmit: SubmitHandler<AnswersFields> = (values) => {
    checkQuestios(values, {
      onSuccess: (data) => {
        setResult(data);
        setShowResult(true);
        data.WrongQuestions.forEach((question) => {
          let questionIndex: number | null = null;
          // find wrong questions id
          form.getValues("answers").find((answer, j) => {
            if (answer.questionId === question.QID) {
              questionIndex = j;
              return true;
            } else {
              return false;
            }
          });
          if (questionIndex) {
            form.setError(`answers.${questionIndex}`, {
              message: question.correctAnswer,
            });
          }
        });
      },
    });
  };

  if (result && showResult === true) {
    return <Score result={result} setShowResult={setShowResult} />;
  }

  return (
    <div className="flex flex-col gap-14">
      {/* {result && <p>Your result is {result.total}</p>} */}
      {/* Header */}
      <header className="flex justify-between items-center ">
        {/* Question Number */}
        <p className="text-sm text-main">
          Question {step + 1} of {questions.length}
        </p>
        {/* Exam duration */}
        <Examduration
          duration={questions[0]?.exam.duration ?? 0}
          onTimeChange={(date) => form.setValue("time", date.getMinutes())}
        />
      </header>
      {/* Steps */}
      <ul className="flex justify-between">
        {Array.from({ length: questions.length ?? 0 }, (_, i) => i).map((i) => (
          <li
            key={i}
            className={cn(
              "size-2 bg-gray-300 rounded-full transition-colors",
              step >= i && "bg-main"
            )}
          ></li>
        ))}
      </ul>
      {/* Form */}
      <Form {...form}>
        <form
          {...form}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grow  flex flex-col"
        >
          <FormField
            control={form.control}
            name={`answers.${step}`}
            render={({ field }) => (
              <FormItem>
                {/* label */}
                <FormLabel className="text-xl font-bold py-2">
                  {currentQuestion?.question}
                </FormLabel>
                {/* options */}
                <FormControl className="my-2">
                  <RadioGroup
                    disabled={isPending}
                    value={answer}
                    onValueChange={(value) => {
                      setAnswer(value);
                      field.onChange({
                        questionId: currentQuestion?._id,
                        correct: value,
                      });
                    }}
                    name={currentQuestion?._id}
                    className="flex flex-col space-y-1"
                  >
                    {currentQuestion?.answers.map((answer) => (
                      <FormItem
                        key={answer.key}
                        className="flex items-center space-x-3 space-y-0 border-2 rounded-lg px-2 bg-slate-200 "
                      >
                        <FormControl>
                          {/* Radio */}
                          <RadioGroupItem
                            value={answer.key}
                            className="border-main bg-white"
                          />
                        </FormControl>
                        {/* label */}
                        <FormLabel className="font-normal grow  py-4 px-2 ">
                          {answer.answer}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                {/* Feedback */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* footer */}
          <div className="grid grid-cols-2 gap-12 mt-12 ">
            <Button
              disabled={step == 0 || isPending}
              type="button"
              className="text-main bg-white border border-main rounded-[100px] font-medium text-2xl"
              onClick={() => {
                const previousAnswer = form.getValues(`answers.${step - 1}`);

                if (!previousAnswer?.correct) {
                  setAnswer("");
                } else {
                  setAnswer(previousAnswer.correct);
                }

                setStep((prev) => prev - 1);
              }}
            >
              Back
            </Button>
            <Button
              className="rounded-[100px] font-medium text-2xl"
              type={`${
                step < (questions.length ?? 0) - 1 ? "button" : "submit"
              }`}
              disabled={(() => {
                if (isPending) return true;
                const currentAnswer = form.getValues(`answers.${step}`);
                if (currentAnswer?.correct) return false;
                return true;
              })()}
              onClick={() => {
                if (step === (questions.length ?? 0) - 1) return;
                const nextAnswer = form.getValues(`answers.${step + 1}`);
                if (!nextAnswer?.correct) {
                  setAnswer("");
                } else {
                  setAnswer(nextAnswer.correct);
                }
                setStep((prev) => prev + 1);
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
