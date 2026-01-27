import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-[#e2e8f0] hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#718096] mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-[#1a202c] mb-1">{value}</h3>
            {description && (
              <p className="text-xs text-[#718096]">{description}</p>
            )}
            {trend && (
              <p className={`text-xs mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-[#8b9474]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-[#8b9474]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}