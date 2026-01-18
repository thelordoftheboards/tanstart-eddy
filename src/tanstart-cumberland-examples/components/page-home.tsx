import {
  IconFerry,
  IconNumber11Small,
  IconNumber12Small,
  IconNumber13Small,
  IconNumber14Small,
  IconNumber15Small,
  IconNumber16Small,
  IconNumber17Small,
  IconNumber18Small,
  IconNumber19Small,
  IconNumber20Small,
  IconPentagonNumber1,
  IconPentagonNumber2,
  IconPentagonNumber3,
  IconPentagonNumber4,
  IconPentagonNumber5,
  IconPentagonNumber6,
  type IconProps,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { BookOpen, Menu } from 'lucide-react';
import { ForwardRefExoticComponent, type RefAttributes, useState } from 'react';
import { ThemeToggle } from '~/components/theme-toggle';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

const techStack: {
  category: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  description: string;
  libs: {
    name: string;
    href: string;
  }[];
}[] = [
  {
    category: 'Category 1',
    icon: IconPentagonNumber1,
    description:
      'Vivamus turpis lectus, sollicitudin id purus eget, pharetra varius dolor. Sed sit amet tristique dolor. Nam tincidunt tempus mauris id dapibus.',
    libs: [{ name: 'Lacinia vel', href: 'https://tailwindcss.com/' }],
  },
  {
    category: 'Category 2',
    icon: IconPentagonNumber2,
    description:
      'Cras eros dolor, suscipit non placerat sodales, vestibulum id est. Nullam viverra fringilla orci, eget sodales nibh malesuada laoreet. Sed volutpat fringilla fringilla.',
    libs: [
      { name: 'Justo', href: 'https://ui.shadcn.com/' },
      { name: 'Duis commodo', href: 'https://tailwindcss.com/' },
    ],
  },
  {
    category: 'Category 3',
    icon: IconPentagonNumber3,
    description:
      'Quisque elementum, eros quis malesuada malesuada, lacus massa malesuada libero, sed volutpat nisi orci feugiat magna. Aliquam eu sapien sed odio rhoncus varius.',
    libs: [],
  },
  {
    category: 'Category 4',
    icon: IconPentagonNumber4,
    description:
      'Curabitur nec efficitur mi. Aenean vestibulum diam in purus mattis ornare. Suspendisse vitae eros metus. ',
    libs: [{ name: 'Vivamus lobortis', href: 'https://tailwindcss.com/' }],
  },
  {
    category: 'Category 5',
    icon: IconPentagonNumber5,
    description:
      'Sed aliquet urna vel enim luctus, a iaculis risus sollicitudin. Nunc in imperdiet velit. Mauris posuere ac felis ut malesuada.',
    libs: [{ name: 'Phasellus semper', href: 'https://ui.shadcn.com/' }],
  },
  {
    category: 'Category 6',
    icon: IconPentagonNumber6,
    description:
      'Nunc vel augue a lectus pharetra faucibus eu id dolor. Ut nec ultricies risus. Sed id nisi augue. Integer dictum mauris quis elit rhoncus sagittis.',
    libs: [],
  },
];

export function PageHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <IconFerry className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Tanstart Cumberland</span>
          </div>

          <nav className="hidden items-center justify-center md:flex">
            <ThemeToggle />
            <Link
              className="ml-8 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="ml-8 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              to="/login"
            >
              Login
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button size="icon" variant="ghost">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                }
              />
              <SheetContent className="w-75 sm:w-100" side="right">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconFerry className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">Hey Dispatcher!</span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <ThemeToggle />
                    <Button
                      className="w-full justify-start"
                      render={
                        <Link
                          className="flex items-center gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      }
                      variant="ghost"
                    />
                    <Button
                      className="w-full justify-start"
                      render={
                        <Link className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)} to="/login">
                          Login
                        </Link>
                      }
                      variant="ghost"
                    />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="mb-4 bg-linear-to-r bg-clip-text font-bold text-3xl text-primary tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Tanstart Cumberland
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna vestibulum, eleifend orci non, porta
            neque. Donec et ullamcorper nibh.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Card className="flex flex-col transition-shadow duration-200 hover:shadow-lg" key={tech.category}>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <tech.icon className="h-6 w-6 text-primary" />
                <CardTitle className="font-semibold text-lg">{tech.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="mb-4">{tech.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {tech.libs.map((lib) => (
                    <Badge key={lib.name} variant="secondary">
                      {lib.href ? (
                        <a
                          className="flex items-center gap-1 hover:underline"
                          href={lib.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {lib.name} <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ) : (
                        lib.name
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {
          <section className="mt-16 md:mt-24">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
                Praesent euismod, nisi et efficitur rhoncus
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Urus quam laoreet massa, et pharetra lectus neque a enim. Nullam diam arcu, vulputate quis magna vitae,
                tempor porta mauris
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <IconNumber11Small className="h-6 w-6 text-blue-500" />
                  <CardTitle>Suspendisse semper</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber12Small className="h-4 w-4 shrink-0 text-green-500" />
                    <span>Suspendisse semper</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber13Small className="h-4 w-4 shrink-0 text-green-500" />
                    <span>Proin rhoncus sagittis lacus</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <IconNumber14Small className="h-6 w-6 text-green-500" />
                  <CardTitle>Vitae pulvinar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber15Small className="h-4 w-4 shrink-0 text-green-500" />
                    <span>Praesent tempor sagittis laoreet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber16Small className="h-4 w-4 shrink-0 text-yellow-500" />
                    <span>Duis lorem augue</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <IconNumber17Small className="h-6 w-6 text-purple-500" />
                  <CardTitle>Nullam lacinia eleifend molestie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber18Small className="h-4 w-4 shrink-0 text-green-500" />
                    <span>Integer fermentum dignissim</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber19Small className="h-4 w-4 shrink-0 text-yellow-500" />
                    <span>Mauris felis nibh</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconNumber20Small className="h-4 w-4 shrink-0 text-yellow-500" />
                    <span>Nullam ligula ante, malesuada nec libero</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        }
      </main>

      <footer className="mt-16 border-t">
        <div className="container py-6 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Your Awesome Company Name.
        </div>
      </footer>
    </div>
  );
}
