'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Calendar, User, Clock, Bookmark } from 'lucide-react'

interface Course {
  id: string
  title: string
  category: string
  duration: number
  description: string
  image: string
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Prenatal Nutrition Guide',
    category: 'Nutrition',
    duration: 12,
    description: 'Learn what foods to eat during pregnancy for optimal health',
    image: '/images/education-nutrition.jpg',
  },
  {
    id: '2',
    title: 'Gentle Pregnancy Exercises',
    category: 'Exercise',
    duration: 15,
    description: 'Safe exercises to stay fit and prepare for labor',
    image: '/images/education-exercise.jpg',
  },
  {
    id: '3',
    title: 'Understanding Your Cycle',
    category: 'Education',
    duration: 10,
    description: 'Deep dive into menstrual cycle phases and what they mean',
    image: '/images/cycle-calendar.jpg',
  },
  {
    id: '4',
    title: 'Mental Health in Pregnancy',
    category: 'Mental Health',
    duration: 18,
    description: 'Managing emotions and stress during pregnancy',
    image: '/images/mother-child-dashboard.jpg',
  },
]

export default function EducationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }
        setUser(authUser)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    )
  }

  const categories = ['All', ...new Set(COURSES.map((c) => c.category))]
  const filteredCourses = selectedCategory && selectedCategory !== 'All'
    ? COURSES.filter((c) => c.category === selectedCategory)
    : COURSES

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Learn & Grow</h1>
          <p className="text-muted-foreground text-sm">Educational resources for your wellness journey</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`whitespace-nowrap transition-all ${
                (selectedCategory === null && category === 'All') || selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-gray-100 text-foreground hover:bg-gray-200'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden border-0 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Course Image */}
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{course.title}</h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {course.category}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration} min</span>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-primary to-accent text-white"
                    size="sm"
                  >
                    Start Course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 p-8 border-0 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Personalized Learning Path</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get AI-recommended courses based on your tracking type and health goals
            </p>
            <Button className="bg-gradient-to-r from-primary to-accent text-white">
              Discover Your Path →
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <Link href="/calendar" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-semibold">Calendar</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
