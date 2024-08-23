FULL_TAG=$1
if ! [[ "$FULL_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "::error::Invalid tag format (expected vX.Y.Z) !"
  exit 1
fi;

MINOR_TAG=`echo $FULL_TAG | cut -d '.' -f 1-2`;
if ! [[ "$MINOR_TAG" =~ ^v[0-9]+\.[0-9]+$ ]]; then
  echo "::error::Invalid minor tag format (expected vX.Y) !"
  exit 2
fi;

MAJOR_TAG=`echo $FULL_TAG | cut -d '.' -f 1`;
if ! [[ "$MINOR_TAG" =~ ^v[0-9]+\.[0-9]+$ ]]; then
  echo "::error::Invalid major tag format (expected vX) !"
  exit 3
fi;
echo "MINOR=$MINOR_TAG"
echo "MAJOR=$MAJOR_TAG"

git tag -f $MINOR_TAG && \
  git tag -f $MAJOR_TAG && \
  git push origin --force $MINOR_TAG $MAJOR_TAG;
