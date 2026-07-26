import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../_components/ui/card';
import { Separator } from '../_components/ui/separator';
import { AddTodo } from './add-todo/add-todo';
import { HomePageProvider } from './context';
import { UserMenu } from './user-menu/user-menu';
import { Todos } from './todos/todos';
import { provideTemplateData } from './provide-template-data';

// NOTE(harunou): this is a template, executed on the server
export default async function HomePage() {
  // NOTE(harunou): this is data interpolation into the template
  const { todos } = await provideTemplateData();

  return (
    <HomePageProvider>
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="flex-1" data-testid="home-title">
            TODOs
          </CardTitle>
          <UserMenu />
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col p-6 gap-4">
          <AddTodo />
          <Todos todos={todos} />
        </CardContent>
      </Card>
    </HomePageProvider>
  );
}
