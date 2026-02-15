import { Box, Heading, List, ListItem, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function RelatedPages({ pages = [] }) {
    if (!pages || pages.length === 0) return null;

    return (
        <Box mt={12} mb={12}>
            <Heading as="p" size="lg" mb={4}>
                Related Pages
            </Heading>
            <List spacing={2}>
                {pages.map((page) => (
                    <ListItem key={page._id}>
                        <NextLink href={`/${page.slug.current}`} passHref>
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