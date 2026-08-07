import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogArticleHyaluronsaeure from "./pages/BlogArticleHyaluronsaeure";
import BlogArticleHauttypen from "./pages/BlogArticleHauttypen";
import BlogArticleInhaltsstoffe from "./pages/BlogArticleInhaltsstoffe";
import BlogArticleRoutine from "./pages/BlogArticleRoutine";
import BlogArticleSonnenschutz from "./pages/BlogArticleSonnenschutz";
import BlogArticleVitaminC from "./pages/BlogArticleVitaminC";
import Cleaners from "./pages/Cleaners";
import Peelings from "./pages/Peelings";
import ProductSerum from "./pages/ProductSerum";
import ProductCreme from "./pages/ProductCreme";
import ProductCleaner from "./pages/ProductCleaner";
import ProductCleanerMilk from "./pages/ProductCleanerMilk";
import ProductPeeling from "./pages/ProductPeeling";
import ProductPeelingAHA from "./pages/ProductPeelingAHA";
import ProductSunscreen from "./pages/ProductSunscreen";
import ProductGuaSha from "./pages/ProductGuaSha";
import ConfiguratorSerum from "./pages/ConfiguratorSerum";
import ConfiguratorCreme from "./pages/ConfiguratorCreme";

import RoutineOverview from "./pages/RoutineOverview";
import RoutineTemplate from "./pages/RoutineTemplate";
import SkinTest from "./pages/SkinTest";
import Gutschein from "./pages/Gutschein";
import ShopifyAccountRedirect from "./pages/ShopifyAccountRedirect";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminReviews from "./pages/AdminReviews";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Withdrawal from "./pages/Withdrawal";
import Impressum from "./pages/Impressum";
function Router() {
  const [location] = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/hyaluronsaeure"} component={BlogArticleHyaluronsaeure} />
      <Route path={"/blog/hauttypen"} component={BlogArticleHauttypen} />
      <Route path={"/blog/inhaltsstoffe"} component={BlogArticleInhaltsstoffe} />
      <Route path={"/blog/routine"} component={BlogArticleRoutine} />
      <Route path={"/blog/sonnenschutz"} component={BlogArticleSonnenschutz} />
      <Route path={"/blog/vitamin-c"} component={BlogArticleVitaminC} />
      <Route path={"/cleaners"} component={Cleaners} />
      <Route path={"/peelings"} component={Peelings} />
      <Route path={"/product/serum"} component={ProductSerum} />
      <Route path={"/product/creme"} component={ProductCreme} />
      <Route path={"/product/cleaner"} component={ProductCleaner} />
      <Route path={"/product/cleaner-milk"} component={ProductCleanerMilk} />
      <Route path={"/product/peeling"} component={ProductPeeling} />
      <Route path={"/product/peeling-aha"} component={ProductPeelingAHA} />
      <Route path={"/product/sunscreen"} component={ProductSunscreen} />
      <Route path={"/product/gua-sha-jade"} component={ProductGuaSha} />
      <Route path={"/configurator/serum"} component={ConfiguratorSerum} />
      <Route path={"/configurator/creme"} component={ConfiguratorCreme} />

      <Route path={"/products"} component={RoutineOverview} />
      <Route path={"/routines"} component={RoutineOverview} />
      <Route path={"/routine/:type"} component={RoutineTemplate} />
      <Route path={"/hauttest"} component={SkinTest} />
      <Route path={"/skin-test"} component={SkinTest} />
      <Route path={"/gutschein"} component={Gutschein} />
      <Route path={"/account"} component={ShopifyAccountRedirect} />
      <Route path={"/account/subscriptions"} component={ShopifyAccountRedirect} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/order-confirmation"} component={OrderConfirmation} />
      <Route path={"/admin/reviews"} component={AdminReviews} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/shipping"} component={Shipping} />
      <Route path={"/withdrawal"} component={Withdrawal} />
      <Route path={"/impressum"} component={Impressum} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <CartSidebar />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
