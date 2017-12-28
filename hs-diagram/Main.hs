{-# LANGUAGE
FlexibleContexts,
LambdaCase,
NoMonomorphismRestriction,
RankNTypes,
ScopedTypeVariables,
TupleSections,
TypeFamilies,
ViewPatterns
  #-}

-- | usage: load this file into ghci and run main.

import Control.Exception
import Debug.Trace
import Data.List
import Data.Foldable (Foldable, toList)
import Data.Monoid hiding ((<>))
import Control.Applicative
import Control.Lens hiding (_1, _2, lens, choosing, united, (%~), (#))
import Data.Bifunctor
import System.FilePath ((</>))
import qualified Data.Set as Set
import qualified Data.Map as Map

import Diagrams.Prelude
import Diagrams.Backend.SVG


data Shape = Diamond | Round | Squiggle
  deriving (Eq, Ord, Show, Enum, Bounded)

data CardColor = Red | Green | Blue
  deriving (Eq, Ord, Show, Enum, Bounded)

data Filling = FillingEmpty | Solid | GrayedOut
  deriving (Eq, Ord, Show, Enum, Bounded)

data Number = One | Two | Three
  deriving (Eq, Ord, Show, Enum, Bounded)

type Card = (Shape, CardColor, Filling, Number)

allCards :: [Card]
allCards = (,,,) <$> [minBound ..] <*> [minBound ..] <*> [minBound ..] <*> [minBound ..]


renderCard :: Card -> Diagram B
renderCard (shape, renderCardColor -> cardColor, filling, number) = atoms `atop` rim # frame 1.3
  where
    atoms = renderNumber atom number
    atom = renderShape shape
      # fillShape filling cardColor
      # lc cardColor
      # lw 5

    rim = roundedRect 4 6.5 0.7 # lw 4 # fc white

renderShape :: Shape -> Diagram B
renderShape Diamond  = square 0.8 # rotateBy 0.125 # scaleX 2.2
renderShape Round    = ellipseXY 1.4 0.5
renderShape Squiggle = (circle 1 # scaleX 0.6 :: Path V2 Double) # deform' 0.0001 wibble # strokeP # rotateBy 0.25 # scaleY 0.8

-- https://archives.haskell.org/projects.haskell.org/diagrams/doc/manual.html#basic-2d-types
wibble :: Deformation V2 V2 Double
wibble = Deformation $ \p -> ((p^._x) + 0.3 * cos ((p ^. _y) * tau)) ^& (p ^. _y)
  -- perturb x-coordinates by the cosine of the y-coordinate

fillShape :: Filling -> Colour Double -> Diagram B -> Diagram B
fillShape FillingEmpty _ d = d # fc white
fillShape Solid        c d = d # fc c
fillShape GrayedOut    c d = d `atop` (d # fc c . (dotpattern `clipBy`))
  where
    dotpattern :: Path V2 Double
    dotpattern = ((`atPoints` repeat (circle dotradius)) $ p2
                   <$> [ (fromIntegral x / step, fromIntegral y / step) | x <- range, y <- range ])

    dotradius = 0.05
    step = 6.8
    range = [-20 .. 20]  -- (there are probably tighter bounds than these, but these work)

renderNumber :: Diagram B -> Number -> Diagram B
renderNumber atom (fromEnum -> n) = replicate (n + 1) atom
  # vsep 0.2
  # centerXY

renderCardColor :: CardColor -> Colour Double
renderCardColor = bright
  where
    bright Red   = sRGB 0.3 0.3 1
    bright Green = sRGB 0.02 0.88 0.0
    bright Blue  = sRGB 0.88 0 0.02

    goth Red   = purple
    goth Green = orange
    goth Blue  = black


printCard :: FilePath -> Card -> IO ()
printCard fpath card = renderSVG (fpath </> cardName card) (dims (r2 (400, 400))) $ renderCard card

cardName :: Card -> FilePath
cardName (shape, cardColor, filling, number) =
  intercalate "-" [show shape, show cardColor, show filling, show number] <> ".svg"


main :: IO ()
main = do
  -- renderSVG ("svg/Diamond-Red-FillingEmpty-One.svg") (dims (r2 (400, 400))) $ test
  -- let cards = [(Diamond, Red, GrayedOut, Two)]  -- allCards
  let cards = allCards
  printCard "svg" `mapM_` cards
  writeFile "svg/index.html" . mconcat $ (\c -> "<img src=" <> show (cardName c) <> ">") <$> cards


jsAllCards :: String
jsAllCards = intercalate ",\n  " $ (\(s, c, f, n) -> "{ shape: \"" <> show s <> "\", color: \"" <> show c <> "\", filling: \"" <> show f <> "\", number: \"" <> show n <> "\" }") <$> allCards




solve :: [Card] -> [(Card, Card, Card)]
solve xs = [(a, b, c) | a <- xs, b <- xs, c <- xs
                      , a < b
                      , b < c
                      , allEqOrAllDiff _1 a b c
                      , allEqOrAllDiff _2 a b c
                      , allEqOrAllDiff _3 a b c
                      , allEqOrAllDiff _4 a b c
                      ]
  where
    allEqOrAllDiff :: Eq a => Lens' Card a -> Card -> Card -> Card -> Bool
    allEqOrAllDiff l ((^. l) -> a) ((^. l) -> b) ((^. l) -> c) = length (nub [a, b, c]) `elem` [1, 3]


testSolve :: IO ()
testSolve = do
  print $ solve (take 3 allCards) == [((Diamond,Red,FillingEmpty,One),(Diamond,Red,FillingEmpty,Two),(Diamond,Red,FillingEmpty,Three))]
  print $ solve (take 12 allCards)
