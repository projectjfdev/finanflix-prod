import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getCourseDetails(id: string) {
  // Simular una llamada a la API para obtener detalles del curso
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    title: "Curso Avanzado de React",
    price: 99.99,
    description: "Aprende React desde cero hasta un nivel avanzado"
  }
}

export default async function OrderSummary({ courseId }: { courseId: string }) {
  const course = await getCourseDetails(courseId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.description}</p>
          </div>
          <div className="flex justify-between">
            <span>Precio:</span>
            <span className="font-semibold">${course.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${course.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

