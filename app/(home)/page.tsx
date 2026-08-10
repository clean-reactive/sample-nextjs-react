import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../_components/ui/card';
import { Separator } from '../_components/ui/separator';
import { AddTodo } from './add-todo/add-todo';
import { HomePageProvider } from './context';
import { UserMenu } from './user-menu';
import { Todos } from './todos/todos';
import { homePageAction } from './page.action';

// NOTE(harunou): HomePage is a template, executed on the server. Unlike a
// classic router(handler) -> data processing -> template
// processing(interpolation) flow, control starts here: router calls the
// template, the template calls its own page action to get the data it needs.
export default async function HomePage() {
  // `{ todos }` is the template's interpolated value; see HomePageAction.
  const { todos } = await homePageAction();

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
