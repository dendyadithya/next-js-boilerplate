'use client'

import { useServicesMenu } from '@/hooks/use-services-menu'
import { motion } from 'motion/react'
import { Link } from 'next-view-transitions'
import Icon from '@/components/ui/icon'

export default function ServiceList() {
  const servicesMenu = useServicesMenu()

  return (
    <div className="relative grid w-full max-w-5xl grid-cols-1 gap-6 px-8 sm:grid-cols-2 lg:grid-cols-3">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" />

      {servicesMenu.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative z-10"
        >
          <Link href={item.link} className="block h-full">
            <motion.div
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/30 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:from-gray-900/80 dark:to-gray-800/30"
            >
              <div className="relative z-10 flex h-full flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="inline-flex rounded-xl bg-primary/10 p-3 backdrop-blur-sm">
                    <Icon icon="lucide:folder" className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm font-medium text-primary">Lihat halaman</div>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="rounded-full bg-primary/10 p-2 backdrop-blur-sm"
                  >
                    <Icon icon="lucide:arrow-right" className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-300 group-hover:bg-primary/20" />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-300 group-hover:bg-primary/20" />
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
