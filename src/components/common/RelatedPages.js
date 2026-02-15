import { Box, Heading, List, ListItem, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';

export default function RelatedPages({ pages = [] }) {
    const { t } = useTranslation();
    if (!pages || pages.length === 0) return null;

    return (
        <Box mt={12} mb={12}>
            <Heading as="p" size="lg" mb={4}>
                {t('tool.related-pages', 'Related Pages')}
            </Heading>
            <List spacing={2}>
                {pages.map((page) => (
                    <ListItem key={page._id}>
                        <NextLink href={`/${page.slug}`} passHref>
                            <Link color="purple.600" _hover={{ color: 'purple.800', textDecoration: 'underline' }}>
                                {page.title}
                            </Link>
                        </NextLink>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}