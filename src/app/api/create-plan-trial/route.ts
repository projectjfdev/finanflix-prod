import { NextResponse } from "next/server";
import { createPlan } from "@/lib/Paypal";

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const product_id = formData.get("product_id") as string;

  // PLAN CON FREE TRIAL 1 MES

  const plan = {
    name,
    product_id,
    billing_cycles: [
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "TRIAL", // Ciclo de prueba
        sequence: 1,
        total_cycles: 1, // Duración del ciclo de prueba en meses
        pricing_scheme: {
          fixed_price: {
            value: "0", // Precio del mes de prueba (gratis)
            currency_code: "USD",
          },
        },
      },
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "REGULAR", // Ciclo regular
        sequence: 2,
        total_cycles: 0, // Total de ciclos regulares ilimitados
        pricing_scheme: {
          fixed_price: {
            value: price, // Precio mensual regular
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      // auto_bill_outstanding: true,
      // setup_fee_failure_action: "CONTINUE",
      // payment_failure_threshold: 3,
      auto_bill_outstanding: true,
      setup_fee_failure_action: "CANCEL", // Cambiar CONTINUE por CANCEL
      payment_failure_threshold: 1, // Opcional: Puedes configurar el umbral para 1 fal
    },
  };

  try {
    const data = await createPlan(plan);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
